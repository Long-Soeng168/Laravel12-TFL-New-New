<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemBodyType;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use App\Models\ItemModel;
use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Retrieve request parameters with defaults
        $search = $request->input('search', '');
        $categoryId = $request->input('categoryId');
        $bodyTypeId = $request->input('bodyTypeId');
        $brandId = $request->input('brandId');
        $shopId = $request->input('shopId');
        $brandModelId = $request->input('brandModelId');
        $sortBy = $request->input('sortBy', 'id'); // Default sort by 'id'
        $sortOrder = $request->input('sortOrder', 'desc'); // Default order 'asc'
        $perPage = $request->input('perPage', 10); // Default 50 items per page

        // Start building the query
        $query = Item::query();

        $query->where('status', 'active');

        // Apply search filter
        if (!empty($search)) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        // Apply playlist filter
        if (!empty($categoryId)) {
            $category = ItemCategory::where('id', $categoryId)->first();
            $query->where('category_code', $category ? $category->code : null);
        }
        if (!empty($bodyTypeId)) {
            $bodyType = ItemBodyType::where('id', $bodyTypeId)->first();
            $query->where('body_type_code', $bodyType  ? $bodyType->code : null);
        }

        if (!empty($brandId)) {
            $brand = ItemBrand::where('id', $brandId)->first();
            $query->where('brand_code', $brand ? $brand->code : null);
        }

        if (!empty($shopId)) {
            $query->where('shop_id', $shopId);
        }

        if (!empty($brandModelId)) {
            $model = ItemModel::where('id', $brandModelId)->first();
            $query->where('model_code', $model ? $model->code : null);
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        // Paginate the results
        // $query->select('id', 'name', 'image', 'price', 'is_instock', 'category_id');
        $query->with(['images', 'category', 'brand', 'model', 'body_type']);
        $products = $query->paginate($perPage);

        $products->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'name_kh' => $item->name_kh,
                'code' => $item->code,
                'short_description' => $item->short_description,
                'price' => $item->price,
                'category_id' => optional($item->category)->id,
                'brand_id' => optional($item->brand)->id,
                'model_id' => optional($item->model)->id,
                'body_type_id' => optional($item->body_type)->id,
                'shop_id' => $item->shop_id,
                'status' => $item->status,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'image' => optional($item->images->first())->image,
                // add more fields if needed
            ];
        });

        return response()->json($products);
    }
    public function relatedProducts($id)
    {
        // Find the product by its ID or throw a 404 error
        $product = Item::findOrFail($id);

        // Number of products per page (define the $perPage variable)
        $perPage = 10;

        // Query to get products in the same category, excluding the current product
        $query = Item::where('category_code', $product->category_code)
            ->where('id', '!=', $product->id)
            ->orderBy('id', 'desc');

        // Select the necessary columns and paginate
        $query->with(['images']);

        $products = $query->paginate($perPage);

        $products->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'name_kh' => $item->name_kh,
                'code' => $item->code,
                'short_description' => $item->short_description,
                'price' => $item->price,
                'category_id' => optional($item->category)->id,
                'brand_id' => optional($item->brand)->id,
                'model_id' => optional($item->model)->id,
                'body_type_id' => optional($item->body_type)->id,
                'shop_id' => $item->shop_id,
                'status' => $item->status,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'image' => optional($item->images->first())->image,
                // add more fields if needed
            ];
        });

        // Return the paginated products as a JSON response
        return response()->json($products);
    }

    public function getProductsByShop(String $shop_id)
    {
        $products = Item::where('shop_id', $shop_id)->latest()->paginate(10);
        return response()->json($products);
    }

    // public function getProductsByCategory(String $category_id)
    // {
    //     $category = ItemCategory::where('id', $category_id)->first();
    //     $products = Item::where('category_code', $category ? $category->code : null)->latest()->paginate(10);
    //     return response()->json($products);
    // }

    // public function getProductsByBodyType(String $body_type_id)
    // {

    //     $products = Item::where('body_type_id', $body_type_id)->latest()->paginate(10);
    //     return response()->json($products);
    // }

    // public function getProductsByBrand(String $brand_id)
    // {
    //     $products = Item::where('brand_id', $brand_id)->latest()->paginate(10);
    //     return response()->json($products);
    // }

    // public function getProductsByModel(String $model_id)
    // {
    //     $products = Item::where('model_id', $model_id)->latest()->paginate(10);
    //     return response()->json($products);
    // }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $item = Item::with('category', 'body_type', 'brand', 'brand_model', 'images')->find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Convert to old key structure
        $product = [
            'product_id'       => $item->id,
            'name'             => $item->name,
            'price'            => (float)$item->price,
            'description'      => $item->long_description,
            'category_id'      => $item->category ? $item->category->id : null,
            'brand_id'         => $item->brand ? $item->brand->id : null,
            'model_id'         => $item->brand_model ? $item->brand_model->id : null,
            'body_type_id'     => $item->body_type ? $item->body_type->id : null,
            'status'           => $item->status === 'active' ? 1 : 0,
            'create_by_user_id' => $item->created_by,
            'updated_by'       => $item->updated_by,
            'category'       => $item->category,
            'body_type'       => $item->body_type,
            'brand'       => $item->brand,
            'brand_model'       => $item->brand_model,
            'shop_id' => $item->shop_id,
            'images'           => $item->images->skip(1)->map(function ($image) {
                return [
                    'id'         => $image->id,
                    'image'      => $image->image,
                    'product_id' => $image->item_id, // keep it product_id for old key
                ];
            }),
            'created_at'       => $item->created_at,
            'updated_at'       => $item->updated_at,
        ];

        return response()->json($product);
    }
}
