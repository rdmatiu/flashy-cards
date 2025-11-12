import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Button } from '@/components/ui/button';
import './globals.css';

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Flashy Cards',
	description: 'A modern flashcard application',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang='en' className='dark'>
				<body className={`${poppins.variable} antialiased`}>
					<header className='border-b border-gray-800 bg-gray-950'>
						<nav className='container mx-auto flex items-center justify-between p-4'>
							<h1 className='text-xl font-semibold'>Flashy Cards</h1>
							<div className='flex items-center gap-4'>
								<SignedOut>
									<SignInButton mode='modal'>
										<Button className='bg-blue-600 hover:bg-blue-700'>
											Sign In
										</Button>
									</SignInButton>
									<SignUpButton mode='modal'>
										<Button className='bg-blue-600 hover:bg-blue-700'>
											Sign Up
										</Button>
									</SignUpButton>
								</SignedOut>
								<SignedIn>
									<UserButton afterSignOutUrl='/' />
								</SignedIn>
							</div>
						</nav>
					</header>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
