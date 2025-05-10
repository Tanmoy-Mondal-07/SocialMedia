import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../component';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import appwriteReportServiceConfig from '../appwrite/reportConfig';
import { hideLoading, showLoading } from '../store/LodingState';

function Report() {
    const { postId } = useParams();
    const [submitResponse, setSubmitResponse] = useState(null);
    const userInfo = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        dispatch(showLoading());
        try {
            const response = await appwriteReportServiceConfig.createReports({
                userId: userInfo.$id,
                postId: postId,
                reporttext: data.reportText,
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
            <div className="bg-body-0 p-6 shadow-lg rounded-2xl max-w-md mx-auto text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-2">Report Submitted Successfully</h2>
                <p className="text-text-color-300">
                    Thank you for your submission. Your report has been received and is currently under review.
                </p>
                <p className="text-text-color-300 mt-2">
                    Reference ID: <strong>#{submitResponse}</strong>
                </p>
                <p className="text-body-600 mt-4">
                    We will notify you promptly with any updates regarding your report. If you have further questions, feel free to contact our support team.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-body-0 p-6 shadow-lg rounded-2xl max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-text-color-400">Report</h2>
            {postId && (postId !== 'null') && (
                <p className="text-right text-xs font-mono mb-4 text-red-800">PID: #{postId}</p>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="reportText" className="block text-text-color-300 mb-2">
                        Report Details
                    </label>
                    <textarea
                        id="reportText"
                        {...register('reportText', {
                            required: 'Report is required',
                            maxLength: { value: 500, message: 'Max length is 500 characters' },
                        })}
                        className={`w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.reportText ? 'border-text-denger' : 'border-body-300'
                            }`}
                        placeholder="Enter your report details..."
                        disabled={isSubmitting}
                    />
                    {errors.reportText && (
                        <p className="text-text-denger text-sm mt-1">{errors.reportText.message}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    classNameActive="w-full py-2 rounded-lg focus:ring-2 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </form>
        </div>
    );
}

export default Report;