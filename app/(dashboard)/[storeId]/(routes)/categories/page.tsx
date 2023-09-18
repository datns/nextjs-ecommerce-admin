import {BillboardClient} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/client";
import prismadb from "@/lib/prismadb";
import format from 'date-fns/format'
import {CategoryClient} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/client";
import {CategoryColumn} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";

const CategoriesPage = async ({
	params
							  }: {
	params: { storeId: string }
}) => {
	const categories = await prismadb.category.findMany({
		where: {
			storeId: params.storeId
		},
		include: {
			billboard: true,
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	console.log('categories 1', categories);

	const formatCategories: CategoryColumn[] = categories.map((item) => ({
		id: item.id,
		name: item.name,
		billboardLabel: item.billboard.label,
		createdAt: format(item.createdAt, 'MMMM do, yyyy')
	}))
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoryClient data={formatCategories} />
			</div>
		</div>
	)
}

export default CategoriesPage;
