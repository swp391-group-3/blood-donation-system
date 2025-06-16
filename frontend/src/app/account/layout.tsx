import { Button } from '@/components/ui/button'
import { BarChart3, Settings, Shield, Users } from 'lucide-react'
import React from 'react'

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm border-r">
                <div className="p-6">
                    <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                    </div>
                </div>
                <nav className="px-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-blue-50 text-blue-700">
                        <Users className="h-4 w-4" />
                        User Management
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                </nav>
            </div>

            {children}
        </div>
    )
}

export default Layout