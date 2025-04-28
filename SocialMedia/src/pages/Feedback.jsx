import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../component';
import { useDispatch, useSelector } from 'react-redux';
import appwriteReportServiceConfig from '../appwrite/reportConfig';
import { hideLoading, showLoading } from '../store/LodingState';

function Feedback() {
    const [submitResponse, setSubmitResponse] = useState(null);
    const userInfo = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        // console.log(data);
        dispatch(showLoading());
        try {
            const response = await appwriteReportServiceConfig.createReports({
                userId: userInfo.$id,
                postId: null,
                reporttext: data.feedbackText,
            });
            setSubmitResponse(response.$id);
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    if (submitResponse) {
        return (
            <div className="bg-white p-6 shadow-lg rounded-2xl max-w-md mx-auto text-center">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Thank You for Your Feedback</h2>
                <p className="text-gray-700">
                    We sincerely appreciate you taking the time to share your thoughts with us. Your insights are invaluable and help us enhance our services.
                </p>
                <p className="text-gray-700 mt-2">
                    Rest assured, we are committed to using your feedback to improve our app and provide a better experience for all our users.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Feedback</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="feedbackText" className="block text-gray-700 mb-2">
                        Your Feedback
                    </label>
                    <textarea
                        id="feedbackText"
                        {...register('feedbackText', {
                            required: 'Feedback is required',
                            maxLength: { value: 500, message: 'Max length is 500 characters' },
                        })}
                        className={`w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.feedbackText ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter your feedback..."
                        disabled={isSubmitting}
                    />
                    {errors.feedbackText && (
                        <p className="text-red-500 text-sm mt-1">{errors.feedbackText.message}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    classNameActive="w-full py-2 rounded-lg focus:ring-2 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
            </form>
        </div>
    );
}

export default Feedback;