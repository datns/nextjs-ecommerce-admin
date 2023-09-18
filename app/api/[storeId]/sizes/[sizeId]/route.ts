import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(
	_req: Request,
	{ params } : { params: { sizeId: string }}
) {
	try {
		const {userId} = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 })
		}

		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 })
		}

		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			}
		})

		return NextResponse.json(size);
	} catch (e) {
		console.log('[SIZE_GET]', e);
		return new NextResponse("Internal error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params } : { params: { storeId: string, sizeId: string }}
) {
	try {
		const {userId} = auth();

		const body = await req.json();

		const { name, value } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 })
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 })
		}

		if (!value) {
			return new NextResponse("Value is required", { status: 400 })
		}

		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 })
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 })
		}

		const sizes = await prismadb.size.updateMany({
			where: {
				id: params.sizeId,
			},
			data: {
				name,
				value,
			}
		})

		return NextResponse.json(sizes);
	} catch (e) {
		console.log('[SIZE_PATCH]', e);
		return new NextResponse("Internal error", { status: 500 })
	}
}


export async function DELETE(
	_req: Request,
	{ params } : { params: { sizeId: string, storeId: string }}
) {
	try {
		const {userId} = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 })
		}

		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 })
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 })
		}

		const size = await prismadb.size.deleteMany({
			where: {
				id: params.sizeId,
			}
		})

		return NextResponse.json(size);
	} catch (e) {
		console.log('[SIZE_DELETE]', e);
		return new NextResponse("Internal error", { status: 500 })
	}
}

