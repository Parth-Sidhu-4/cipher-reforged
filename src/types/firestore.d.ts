export type Team = {
	name: string;
	level: number;
	last_change?: FirebaseFirestore.Timestamp;
	created?: Date;
	members?: string[];
};
