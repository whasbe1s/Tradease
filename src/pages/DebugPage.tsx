import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TerminalItem } from '../types';

export const DebugPage: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const runDiagnostics = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Starting diagnostics...');

        try {
            // 1. Check Auth
            addLog('Checking Auth Session...');
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            if (authError) throw new Error(`Auth Error: ${authError.message}`);
            if (!session) {
                addLog('❌ No active session found. User is not logged in.');
                return;
            }
            addLog(`✅ User logged in: ${session.user.id}`);

            // 2. Check Table Access (Read)
            addLog('Checking "links" table read access...');
            const { count, error: countError } = await supabase
                .from('links')
                .select('*', { count: 'exact', head: true });

            if (countError) throw new Error(`Read Error: ${countError.message}`);
            addLog(`✅ Read access confirmed. Total rows: ${count}`);

            // 3. Check Insert (Write)
            addLog('Attempting dummy insert...');
            const dummyLink: Partial<TerminalItem> = {
                title: 'DEBUG_TEST_ENTRY',
                url: 'https://example.com',
                description: 'Diagnostic test entry',
                tags: ['debug', 'test'],
                type: 'resource',
                created_at: new Date().toISOString(),
                favorite: false,
                user_id: session.user.id // Explicitly adding user_id
            };

            const { data, error: insertError } = await supabase
                .from('links')
                .insert([dummyLink])
                .select()
                .single();

            if (insertError) {
                addLog(`❌ Insert Failed: ${JSON.stringify(insertError, null, 2)}`);
                // Check specifically for column errors
                if (insertError.message.includes('column')) {
                    addLog('👉 This suggests a schema mismatch. Check if all columns in the payload exist in the DB.');
                }
            } else {
                addLog('✅ Insert successful!');
                addLog(`Created ID: ${data.id}`);

                // Cleanup
                addLog('Cleaning up test entry...');
                const { error: deleteError } = await supabase
                    .from('links')
                    .delete()
                    .eq('id', data.id);

                if (deleteError) addLog(`⚠️ Cleanup failed: ${deleteError.message}`);
                else addLog('✅ Cleanup successful.');
            }

        } catch (err: any) {
            addLog(`🔥 CRITICAL ERROR: ${err.message}`);
        } finally {
            setLoading(false);
            addLog('Diagnostics complete.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 text-nothing-dark">
            <h1 className="text-2xl font-bold mb-6">Supabase Diagnostics</h1>

            <button
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-nothing-dark text-nothing-base px-6 py-3 rounded-xl font-mono uppercase tracking-wider hover:bg-nothing-dark/90 disabled:opacity-50 mb-8"
            >
                {loading ? 'Running...' : 'Run Diagnostics'}
            </button>

            <div className="bg-nothing-dark/5 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                {logs.length === 0 ? (
                    <div className="text-nothing-dark/40 italic">Logs will appear here...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-2 border-b border-nothing-dark/5 pb-1 last:border-0">
                            {log}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
