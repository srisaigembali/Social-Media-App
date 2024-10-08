import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { createPost } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

type PostFormProps = {
	post?: Models.Document;
	action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { user } = useUserContext();

	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post ? post?.caption : "",
			file: [],
			location: post ? post.location : "",
			tags: post ? post.tags.join(",") : "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
		const newPost = await createPost({
			...values,
			userId: user.id,
		});

		if (!newPost) {
			toast({
				title: `${action} post failed. Please try again.`,
			});
		}
		navigate("/");
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='flex flex-col gap-9 w-full  max-w-5xl'
			>
				<FormField
					control={form.control}
					name='caption'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>Caption</FormLabel>
							<FormControl>
								<Textarea
									className='shad-textarea custom-scrollbar'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='file'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>Add Photos</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.image}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>Add Location</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='shad-input'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>Add Tags (separated by comma " , ")</FormLabel>
							<FormControl>
								<Input
									placeholder='JS, React, NextJS'
									type='text'
									className='shad-input'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<div className='flex gap-4 items-center justify-end'>
					<Button
						type='button'
						className='shad-button_dark_4'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						className='shad-button_primary whitespace-nowrap'
					>
						{action} Post
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
