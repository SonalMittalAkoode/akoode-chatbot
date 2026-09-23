"use client";

import React from 'react';
import TechCard from './TechCard';

export default function CategorySection({ title, items, activeTech, setActiveTech }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-[#475569] font-bold text-left text-lg">{title}</h3>
            <div className="flex flex-wrap gap-4">
                {items.map((item, index) => (
                    <TechCard
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        index={index}
                        activeTech={activeTech}
                        setActiveTech={setActiveTech}
                    />
                ))}
            </div>
        </div>
    );
}
