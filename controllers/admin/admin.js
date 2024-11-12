const Property = require('../../models/Property');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});

const addProperty = async (req, res) => {
    try {
        const { role } = req.user;
        if (role === 'regular') {
            return res.status(401).json({
                msg: 'Unauthorized Access, Admins Only!',
                status: false
            });
        }

        const { title, description, price, location, propertyType, guestCapacity, bedrooms, privateBed, minimumNights, maximumNights, amenities, checkin, checkout } = req.body;
        if (!title || !description || !price || !location || !propertyType || !guestCapacity || !privateBed || !bedrooms || !minimumNights || !maximumNights || !amenities || !checkin || !checkout) {
            return res.status(400).json({
                message: 'Kindly Enter all Fields',
                status: false
            });
        }

        const files = req.files; // Handle multiple files

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: 'No Images Found',
                status: false,
            });
        }

        const amenitiesArray = amenities.split(',').map(item => item.trim());

        // Array to hold all uploaded image URLs
        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                let dataURI = 'data:' + file.mimetype + ';base64,' + b64;

                const result = await cloudinary.uploader.upload(dataURI, {
                    public_id: `${Date.now()}`,
                    resource_type: 'auto',
                    folder: 'Heristays Properties',
                });

                return result; // Save the URL of each uploaded image
            })
        );

        const property = new Property({
            title,
            description,
            price,
            location,
            propertyType,
            guestCapacity,
            bedrooms,
            privateBed,
            minimumNights,
            maximumNights,
            images: uploadedImages, // Save array of image URLs
            amenities: amenitiesArray,
            created_by: req.user.id,
            bookings:{
                checkin,
                checkout,
                guests: guestCapacity
            }

        });

        const newProperty = await Property.create(property);
        await newProperty.save();
        res.status(200).send({
            msg: 'Property Added Successfully!',
            status: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message,
            status: false
        });
    }
};

const getProperties = async (req, res) => {
    const { title, amenities, price, location, propertyType, page, limit } = req.query;
    const queryObject = {};

    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }

    if (amenities) {
        queryObject.amenities = { $regex: amenities, $options: 'i' };
    }

    if (price) {    
        queryObject.price = price;
    }
    
    if (location) {
        queryObject.location = { $regex: location, $options: 'i' };
    }
    
    if (propertyType) {
        queryObject.propertyType = { $regex: propertyType, $options: 'i' };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;

    try {
        const totalDoc = await Property.countDocuments(queryObject);
        const property = await Property.find(queryObject)
            .sort({ createdAt: -1 })
            .populate({ path: 'created_by', model: 'User' }) // Populate the created_by field
            .skip(skip)
            .limit(limits);

        res.status(200).json({
            msg: 'Property Fetched Successfully',
            status: true,
            data: {
                property,
                totalDoc,
                limits,
                pages,
            }
        });
    } catch (err) {
        console.error('Error populating created_by:', err);
        res.status(500).send({
            msg: err.message,
            status: false
        });
    }
};



const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate({ path: 'created_by', model: 'User' });
        if (!property) {
            return res.status(404).json({
                msg: 'Property not found',
                status: false
            });
        }
        res.status(200).json({
            msg: 'Property Fetched Successfully',
            status: true,
            data: property
        });

    } catch (err) {
        res.status(500).send({
            msg: err.message,
            status: false,
        });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { role } = req.user;
        if (role === 'regular') {
            return res.status(401).json({
                msg: 'Unauthorized Access, Admins Only!',
                status: false
            });
        }

        const { id } = req.params;
        const { title, description, price, location, propertyType, guestCapacity, bedrooms, privateBed, minimumNights, maximumNights, amenities, imagesToKeep } = req.body;

        // Find the property by ID
        const property = await Property.findById({ _id: id });
        if (!property) {
            return res.status(404).json({
                msg: 'Property not found',
                status: false
            });
        }

        // Update basic fields if they are provided
        if (title) property.title = title;
        if (description) property.description = description;
        if (price) property.price = price;
        if (location) property.location = location;
        if (propertyType) property.propertyType = propertyType;
        if (guestCapacity) property.guestCapacity = guestCapacity;
        if (bedrooms) property.bedrooms = bedrooms;
        if (privateBed) property.privateBed = privateBed;
        if (minimumNights) property.minimumNights = minimumNights;
        if (maximumNights) property.maximumNights = maximumNights;

        // Convert amenities to an array if provided
        if (amenities) {
            property.amenities = amenities.split(',').map(item => item.trim());
        }

        // Handle image updates only if imagesToKeep or new files are provided
        const files = req.files; // New images to add, if any

        if (imagesToKeep || (files && files.length > 0)) {
            // Filter out images to delete
            const imagesToDelete = property.images.filter(image => !imagesToKeep?.includes(image.url));

            // Delete images from Cloudinary
            await Promise.all(
                imagesToDelete.map(async (image) => {
                    await cloudinary.uploader.destroy(image.public_id);
                })
            );

            // Keep the images specified in imagesToKeep, if provided
            const updatedImages = imagesToKeep 
                ? property.images.filter(image => imagesToKeep.includes(image.url))
                : property.images;

            // Upload new images if any
            if (files && files.length > 0) {
                const newImages = await Promise.all(
                    files.map(async (file) => {
                        const b64 = Buffer.from(file.buffer).toString('base64');
                        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

                        const result = await cloudinary.uploader.upload(dataURI, {
                            public_id: `${Date.now()}`,
                            resource_type: 'auto',
                            folder: 'Heristays Properties',
                        });

                        return { result}; // Save both URL and public_id
                    })
                );

                // Append new images to the updated images array
                updatedImages.push(...newImages);
            }

            // Update property images
            property.images = updatedImages;
        }

        // Save the updated property
        await property.save();

        res.status(200).json({
            msg: 'Property updated successfully',
            status: true,
            data: property
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err.message,
            status: false
        });
    }
};


const deleteProperty = async (req, res) => {
    try {

        const { role } = req.user;
        if (role === 'regular') {
            return res.status(401).json({
                msg: 'Unauthorized Access, Admins Only!',
                status: false
            });
        }


        const deleted = await Property.findByIdAndDelete({ _id: req.params.id });        
        if (!deleted) {
            return res.status(400).json({
                msg: 'Property not found',
                status: false
            });
        }

        return res.status(200).send({
            msg: 'Property Deleted Successfully!',
            status: true
        });
    } catch (err) {
        res.status(500).send({
            msg: err.message,
            status: false
        });
}};


module.exports = { addProperty, getProperties, getPropertyById, updateProperty, deleteProperty };

