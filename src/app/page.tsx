import { SignIn, SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

export default async function Home() {
	const { userId } = await auth();

	// If user is logged in, redirect to dashboard
	if (userId) {
		redirect('/dashboard');
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-background font-sans'>
			<main className='flex flex-col items-center justify-center gap-8 text-center'>
				<div className='flex flex-col items-center gap-4'>
					<h1 className='text-5xl font-bold tracking-tight text-foreground'>
						FlashyCardy
					</h1>
					<p className='text-xl text-muted-foreground'>
						Your personal flashcard platform
					</p>
				</div>
				<div className='flex gap-4'>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='default' size='lg'>
								Sign In
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle className='sr-only'>Sign In</DialogTitle>
							<SignIn routing='hash' />
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='outline' size='lg'>
								Sign Up
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle className='sr-only'>Sign Up</DialogTitle>
							<SignUp routing='hash' />
						</DialogContent>
					</Dialog>
				</div>
			</main>
		</div>
	);
}
