
import { getFeaturedTour } from "./tourController.js";
import Review from "../models/Review.js"
import Tour from "../models/Tour.js"



export const createReview = async (req, res) => {

    const tourId = req.params.tourID
    if(req.body.rating==null){
        res.status(200).json({ success: false, message: 'Rating is required', data: null });

    }else{


    const newReview = new Review({ ... req.body })

    const savedReview = await newReview.save()
        console.warn("id",savedReview._id);
        //after creating a new review now update the review array of the tour
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });
    }
    // try {

    //     const savedReview = await newReview.save()

    //     //after creating a new review now update the review array of the tour
    //     await Tour.findByIdAndUpdate(tourId, {
    //         $push: { reviews: savedReview._id }
    //     })

    //     res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });

    // } catch (err) {
    //     res.status(200).json({ success: false, message: 'failed to submit' })
    // }
};