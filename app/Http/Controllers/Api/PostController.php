<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostDailyView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $skipId = $request->input('skipId');
        $category_code = $request->input('category_code');
        $categoryId = $request->input('categoryId');

        $query = Post::query();

        $query->with('created_by', 'images', 'category', 'source_detail');

        if ($status) {
            $query->where('status', $status);
        }
        if ($skipId) {
            $query->where('id', '!=', $skipId);
        }
        if ($category_code) {
            $query->where('category_code', $category_code);
        }
        if ($categoryId) {
            $fetchedCate = PostCategory::find($categoryId);
            if ($fetchedCate->code) {
                $query->where('category_code', $fetchedCate->code);
            }
        }

        $query->orderBy('post_date', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->where('status', 'active')->paginate(10);

        return response()->json($tableData);
    }

    public function posts_most_views(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $skipId = $request->input('skipId');
        $category_code = $request->input('category_code');
        $categoryId = $request->input('categoryId');

        $query = Post::query();

        $query->with('created_by', 'images', 'category', 'source_detail');

        if ($status) {
            $query->where('status', $status);
        }
        if ($skipId) {
            $query->where('id', '!=', $skipId);
        }
        if ($category_code) {
            $query->where('category_code', $category_code);
        }
        if ($categoryId) {
            $fetchedCate = PostCategory::find($categoryId);
            if ($fetchedCate->code) {
                $query->where('category_code', $fetchedCate->code);
            }
        }

        $query->orderBy('total_view_counts', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->where('status', 'active')->paginate(10);

        return response()->json($tableData);
    }

    public function show(Post $post)
    {
        $date = now()->toDateString();

        $view = PostDailyView::firstOrCreate(
            ['post_id' => $post->id, 'view_date' => $date],
            ['view_counts' => 0],
        );

        $view->increment('view_counts');

        $post->update([
            'total_view_counts' => $post->total_view_counts + 1,
        ]);

        return response()->json($post->load('created_by', 'images', 'category', 'source_detail'));
    }

    // Post Categories
    public function post_categories(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'order_index');
        $sortDirection = $request->input('sortDirection', 'asc');
        $status = $request->input('status');

        $query = PostCategory::query();

        $query->with(relations: 'children');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->where('parent_code', null)->where('status', 'active')->get();

        return response()->json($tableData);
    }
}
