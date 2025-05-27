"use client";
import {
	Table,
	TableBody,
	td,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 
import { User } from "@/lib/generated/prisma";

export default function UsersTable() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				console.log("Fetching users...");
				const response = await authClient?.admin.listUsers({
					query: { limit: 10 },
				});

				if (response?.data) {
					setUsers(response.data.users as User[]);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch users")
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center p-4">
				<span>Loading users...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center p-4">
				<span className="text-red-500">Error: {error.message}</span>
			</div>
		);
	}

	return (
			<div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
				<table className="md:table-auto table-fixed w-full overflow-hidden admin-table">
					<thead>
						<tr>
								<th>Name</th>
								<th>Email</th>
								<th className="hidden md:block">Role</th>
								<th>Status</th>
								<th>Joined</th>
						</tr>
					</thead>
					<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.role ?? ""}</td>
							<td>
								{user.banned ? (
									<span className="text-red-500">Banned</span>
								) : (
									<span className="text-green-500">Active</span>
								)}
							</td>
							<td>
								{new Date(user.createdAt).toLocaleDateString()}
							</td>
						</tr>
					))}
					</tbody>
				</table>	
			</div>
	 
		 
	);
}