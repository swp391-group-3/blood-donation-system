import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 mr-2">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    LifeLink
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Blood Donation Network
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Connecting donors with those in need. Every donation
                            saves lives and strengthens our community.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Blood Request
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Become a Donor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Donation Process
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Eligibility
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-red-500 text-sm transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                            Contact
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-red-500" />
                                <span className="text-gray-600 text-sm">
                                    1-800-DONATE
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-red-500" />
                                <span className="text-gray-600 text-sm">
                                    help@lifelink.org
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                <span className="text-gray-600 text-sm">
                                    123 Health Center Dr
                                    <br />
                                    Medical District, NY 10001
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} LifeLink. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link
                            href="#"
                            className="text-gray-500 hover:text-red-500 text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-500 hover:text-red-500 text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-500 hover:text-red-500 text-sm transition-colors"
                        >
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
