'use client';

import { useState } from 'react';
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
import { createCardAction } from './actions';

interface AddCardDialogProps {
	deckId: number;
}

export function AddCardDialog({ deckId }: AddCardDialogProps) {
	const [open, setOpen] = useState(false);
	const [front, setFront] = useState('');
	const [back, setBack] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			const result = await createCardAction(deckId, { front, back });

			if (result.success) {
				// Reset form and close dialog
				setFront('');
				setBack('');
				setOpen(false);
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
				<Button>Add Card</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[525px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Card</DialogTitle>
						<DialogDescription>
							Create a new flashcard for this deck. Fill in both the front and
							back of the card.
						</DialogDescription>
					</DialogHeader>

					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='front'>Front</Label>
							<Textarea
								id='front'
								placeholder='Question or term...'
								value={front}
								onChange={e => setFront(e.target.value)}
								rows={3}
								required
							/>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='back'>Back</Label>
							<Textarea
								id='back'
								placeholder='Answer or definition...'
								value={back}
								onChange={e => setBack(e.target.value)}
								rows={3}
								required
							/>
						</div>

						{error && (
							<div className='text-sm text-red-500 font-medium'>{error}</div>
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
							{isSubmitting ? 'Creating...' : 'Create Card'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
