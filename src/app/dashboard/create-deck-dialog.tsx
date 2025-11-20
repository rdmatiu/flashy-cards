'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createDeckAction } from './actions';

interface CreateDeckDialogProps {
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'default' | 'sm' | 'lg';
	children?: React.ReactNode;
}

export function CreateDeckDialog({
	variant = 'default',
	size = 'lg',
	children,
}: CreateDeckDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const result = await createDeckAction(formData);

			if (result.success) {
				// Reset form and close dialog
				setFormData({ name: '', description: '' });
				setOpen(false);
				// Optionally redirect to the new deck
				router.push(`/decks/${result.data.id}`);
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant={variant} size={size}>
						Create New Deck
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[525px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Deck</DialogTitle>
						<DialogDescription>
							Create a new flashcard deck to start adding cards.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>
								Name <span className='text-destructive'>*</span>
							</Label>
							<Input
								id='name'
								placeholder='e.g., Spanish Vocabulary'
								value={formData.name}
								onChange={e =>
									setFormData(prev => ({ ...prev, name: e.target.value }))
								}
								required
								maxLength={255}
								disabled={isSubmitting}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								placeholder='Optional description for your deck'
								value={formData.description}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										description: e.target.value,
									}))
								}
								maxLength={1000}
								disabled={isSubmitting}
								rows={3}
							/>
						</div>
						{error && (
							<div className='text-sm text-destructive font-medium'>
								{error}
							</div>
						)}
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create Deck'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

