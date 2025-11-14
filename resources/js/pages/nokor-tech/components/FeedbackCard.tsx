import React from 'react';

interface FeedbackItem {
    id: number;
    image: string;
    text: string;
    date: string;
}

interface FeedbackListProps {
    feedbacks: FeedbackItem[];
}

const FeedbackCard: React.FC<FeedbackItem> = ({ image, text, date }) => {
    return (
        <div className="py-4 max-w-56 flex flex-col items-center">
            <img src={image} alt="Feedback image" className="w-full object-cover" />
            <p className="text-center py-4 mx-2">{text}</p>
            <p className="text-sm text-gray-400">{date}</p>
        </div>
    );
};

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
    return (
        <div className="hidden md:flex justify-start gap-8 flex-wrap">
            {feedbacks.map((feedback, index) => (
                <FeedbackCard key={feedback.id} {...feedback} />
            ))}
        </div>
    );
};

export default FeedbackList;
