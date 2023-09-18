import {ProductClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import {ProductColumn} from "./components/columns";
import format from 'date-fns/format'
import {formatter} from "@/lib/utils";

const ProductsPage = async ({
	params
							  }: {
	params: { storeId: string }
}) => {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId
		},
		include: {
			category: true,
			size: true,
			color: true,
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	const formatProducts: ProductColumn[] = products.map((item) => ({
		id: item.id,
		name: item.name,
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
		size: item.size.name,
		color: item.color.value,
		createdAt: format(item.createdAt, 'MMMM do, yyyy')
	}))
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient data={formatProducts} />
			</div>
		</div>
	)
}

export default ProductsPage;