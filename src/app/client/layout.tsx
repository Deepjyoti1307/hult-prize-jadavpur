import ClientSidebar from '@/components/ClientSidebar';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            <ClientSidebar />
            <div className="flex-1 w-full bg-[#0a0a0f] relative overflow-hidden">
                {/* Global gradient effects for dashboard */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                {children}
            </div>
        </div>
    );
}
