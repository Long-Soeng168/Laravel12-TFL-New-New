<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\Telegram\TelegramFile;
use NotificationChannels\Telegram\TelegramLocation;
use NotificationChannels\Telegram\TelegramMessage;

class SendTelegramGroupNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['telegram'];
    }

    /**
     * Get the mail representation of the notification.
     */

    public function toTelegram(object $notifiable)
    {
        // return TelegramFile::create()
        //     ->to($notifiable->routeNotificationFor('telegram'))
        //     ->content("Here is an image:")
        //     ->content($this->message)
        //     ->file(file: 'https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_1MB.jpg', 'photo');

        // return TelegramFile::create()
        //     ->to($notifiable->routeNotificationFor('telegram')) // Optional
        //     ->content('Did you know we can set a custom filename too?')
        //     ->document('https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf', 'sample.pdf');

        return TelegramFile::create()
            ->to($notifiable->routeNotificationFor('telegram')) // Optional
            ->content('Awesome *bold* text and [inline URL](http://www.example.com/)')
            ->photo('https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg');
        // ->file('https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg', 'photo'); // local photo

        // return TelegramLocation::create()
        //     ->latitude('40.6892494')
        //     ->longitude('-74.0466891');

        // return TelegramFile::create()
        //     ->content('Sample *video* notification!')
        //     ->video('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4');

        // return TelegramFile::create()
        //     ->content('Woot! We can send animated gif notifications too!')
        //     ->animation('https://sample-videos.com/gif/2.gif');
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
