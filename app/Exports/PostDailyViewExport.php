<?php

namespace App\Exports;

use App\Models\PostDailyView;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PostDailyViewExport implements FromQuery, WithMapping, WithHeadings
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = PostDailyView::query()
            ->with('post')
            ->whereBetween('view_date', [$this->filters['from_date'], $this->filters['to_date']])
            ->orderBy($this->filters['sortBy'], $this->filters['sortDirection']);

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['search'])) {
            $query->whereHas('post', function ($subQuery) {
                $subQuery->where('title', 'LIKE', "%{$this->filters['search']}%");
            });
        }

        return $query;
    }

    public function map($view): array
    {
        return [
            $view->post?->title ?? 'N/A',
            $view->view_date,
            $view->view_counts,
            $view->status ?? 'N/A',
        ];
    }

    public function headings(): array
    {
        return [
            'Post Title',
            'View Date',
            'View Counts',
            'Status',
        ];
    }
}