<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StreamFileController extends Controller
{
    public function streamPdf($path){
        // return $path;
          // Ensure that only authorized users can access the stream
        // if (!auth()->check()) {
        //     abort(403);
        // }

        $filePath = storage_path($path);

        if (!file_exists($filePath)) {
            abort(404); // File not found
        }

        $stream = new \Symfony\Component\HttpFoundation\StreamedResponse(function () use ($filePath) {
            $stream = fopen($filePath, 'r');
            fpassthru($stream);
            fclose($stream);
        });

        $stream->headers->set('Content-Type', 'application/pdf');
        $stream->headers->set('Content-Length', filesize($filePath));

        return $stream;
    }

    public function streamVideo($fileName)
    {

        // Ensure that only authorized users can access the stream
        // if (!auth()->check()) {
        //     abort(403);
        // }

        $filePath = storage_path('videos/original/'.$fileName);

        // return $filePath;
        if (!file_exists($filePath)) {
            abort(404); // File not found
        }

        $stream = new \Symfony\Component\HttpFoundation\StreamedResponse(function () use ($filePath) {
            $stream = fopen($filePath, 'r');
            fpassthru($stream);
            fclose($stream);
        });

        $stream->headers->set('Content-Type', 'video/mp4');
        $stream->headers->set('Content-Length', filesize($filePath));

        return $stream;
    }
}
