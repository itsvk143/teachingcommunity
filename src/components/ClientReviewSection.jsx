'use client';

import React, { useState, useEffect } from 'react';
import ReviewSection from './ReviewSection';

export default function ClientReviewSection(props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <p className="text-center py-10">Loading reviews...</p>;
    }

    return <ReviewSection {...props} />;
}
