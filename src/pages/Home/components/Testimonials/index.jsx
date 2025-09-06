import React from 'react';
import Cards from '@/const/data/Cards';
import Card from './Card';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Points() {
    return (
        <motion.div
            className="mx-auto px-4 my-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <motion.h1
                className='font-semibold text-center my-8 text-[25px] sm:text-[38px]'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Your journey of growth right <br />
                at your campus!
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Cards.map((item) => (
                    <motion.div key={item.id} variants={cardVariants}>
                        <Card item={item} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default Points;
