// Since the test server URL is unknown, we use a placeholder that won't actually fail the frontend
const TEST_SERVER_URL = process.env.TEST_SERVER_URL || "http://placeholder-test-server.local/api/log";

export async function Log(stack: string, level: string, pkg: string, message: string): Promise<void> {
    const payload = { stack, level, package: pkg, message, timestamp: new Date().toISOString() };
    
    try {
        // Log to console locally so we can see it working
        console.log(`[Logging Middleware]`, JSON.stringify(payload));
        
        // Example fetch call (commented out until a real URL is provided)
        /*
        await fetch(TEST_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        */
    } catch (error) {
        console.error(`[Logging Middleware Error] Failed to send log:`, error);
    }
}
