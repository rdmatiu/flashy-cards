import { PricingTable } from '@clerk/nextjs';

export default function PricingPage() {
	return (
		<div className='container mx-auto max-w-5xl px-4 py-12'>
			<div className='mb-8 text-center'>
				<h1 className='mb-4 text-4xl font-bold tracking-tight'>
					Choose Your Plan
				</h1>
				<p className='text-lg text-muted-foreground'>
					Upgrade to Pro for unlimited decks and AI-powered flashcard generation
				</p>
			</div>

			<PricingTable />
		</div>
	);
}
