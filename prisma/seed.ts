import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.teacherActivity.upsert({
		where: { id: "default-image-activity" },
		update: {},
		create: {
			id: "default-image-activity",
			title: "Tạo robot học tập của em",
			type: "image",
			config: JSON.stringify({
				theme: "Robot trong lớp học",
				style: "Sách tranh thiếu nhi",
				enabled: true,
			}),
		},
	});

	await prisma.teacherActivity.upsert({
		where: { id: "default-prompt-template" },
		update: {},
		create: {
			id: "default-prompt-template",
			title: "Giải thích bài học bằng 3 ý ngắn",
			type: "prompt",
			config: JSON.stringify({
				role: "Bạn là trợ lý học tập",
				format: "3 ý ngắn và 1 ví dụ",
			}),
		},
	});
}

main()
	.finally(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
