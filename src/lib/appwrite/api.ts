import { INewUser } from "@/types";
import { account, avatars, databases } from "./config";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "./config";

export const createUserAccount = async (user: INewUser) => {
	try {
		const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl,
		});

		return newUser;
	} catch (error) {
		return error;
	}
};

export const saveUserToDB = async (user: {
	accountId: string;
	email: string;
	name: string;
	imageUrl: string;
	username?: string;
}) => {
	try {
		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			user
		);
		return newUser;
	} catch (error) {
		return error;
	}
};

export const signInAccount = async (user: { email: string; password: string }) => {
	try {
		const session = await account.createEmailPasswordSession(user.email, user.password);
		return session;
	} catch (error) {
		return error;
	}
};

export const getCurrrentUser = async () => {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
	}
};
