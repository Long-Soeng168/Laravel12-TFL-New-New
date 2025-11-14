<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageHelper
{
    public static function uploadAndResizeImage($file, $folder = 'assets/images/projects', $maxWidth = 600, $timePrefixFileName = true)
    {
        if (!$file) {
            return null;
        }

        if ($timePrefixFileName) {
            $image_file_name = time() . '_' . $file->getClientOriginalName();
        } else {
            $image_file_name = $file->getClientOriginalName();
        }


        // Define paths
        $file_path = public_path("$folder/");
        $file_thumb_path = public_path("$folder/thumb/");

        // Create directories if they don't exist
        if (!File::exists($file_path)) {
            File::makeDirectory($file_path, 0755, true, true);
        }
        if (!File::exists($file_thumb_path)) {
            File::makeDirectory($file_thumb_path, 0755, true, true);
        }

        // Store Original Image
        $file->storeAs($folder, $image_file_name, 'real_public');

        // Resize and store thumbnail
        try {
            $image = Image::read($file);
            if ($image->width() > $maxWidth) {
                $image->scale(width: $maxWidth)->save($file_thumb_path . $image_file_name);
            } else {
                $file->storeAs("$folder/thumb", $image_file_name, 'real_public');
            }
            return $image_file_name;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function uploadAndResizeImageWebp($file, $folder = 'assets/images/projects', $maxWidth = 600, $timePrefixFileName = true)
    {
        if (!$file) {
            return null;
        }

        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $image_file_name = $timePrefixFileName ? time() . '_' . $originalFileName . '.webp' : $originalFileName . '.webp';


        // Define paths
        $file_path = public_path("$folder/");
        $file_thumb_path = public_path("$folder/thumb/");

        // Create directories if they don't exist
        if (!File::exists($file_path)) {
            File::makeDirectory($file_path, 0755, true, true);
        }
        if (!File::exists($file_thumb_path)) {
            File::makeDirectory($file_thumb_path, 0755, true, true);
        }

        // Resize and store
        try {
            $image = Image::read($file);
            $image->toWebp(95)->save($file_path . $image_file_name);
            $image->scale(width: $maxWidth)->toWebp(90)->save($file_thumb_path . $image_file_name);
            return $image_file_name;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Delete an image and its thumbnail from storage.
     *
     * @param string|null $imageName The name of the image file.
     * @param string $folder The folder where the image is stored.
     * @return bool Returns true if deleted, false otherwise.
     */
    public static function deleteImage($imageName, $folder = 'assets/images/projects')
    {
        if (!$imageName) {
            return false;
        }

        $file_path = public_path("$folder/$imageName");
        $file_thumb_path = public_path("$folder/thumb/$imageName");

        // Delete main image
        if (File::exists($file_path)) {
            File::delete($file_path);
        }

        // Delete thumbnail
        if (File::exists($file_thumb_path)) {
            File::delete($file_thumb_path);
        }

        return true;
    }
}
