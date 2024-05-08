import goodexample1 from 'public/Images/goodexample1.png'
import goodexample2 from 'public/Images/goodexample2.png'
import badexample1 from 'public/Images/badexample1.png'
import badexample2 from 'public/Images/badexample2.png'
import badexample3 from 'public/Images/badexample3.png'
import checkdistance from 'public/Images/checkdistance.png'
import goodexample3 from 'public/Images/goodexample3.png'
import templateZIP from 'public/Images/IBM_SL_Upload_Template_v1.zip'

import { Button } from 'app/components/ui/button'
import { useState } from 'react'
import { Half2Icon } from '@radix-ui/react-icons'

const GuidePage = () => {


    return (
        <div className="min-h-screen flex items-center justify-center flex-col">

            <div style={{ maxWidth: '800px' }}>
                <h1 className="text-primary text-4xl font-bold font-mono mb-6">
                    Guide to using the Calculator
                </h1>
            </div>
            <div style={{ maxWidth: '800px' }}>
                <p className="mb-6">Calculating your CO2 emissions has never been easier!
                    In this how-to guide, we will guide you through the process of using our
                    calculator, whether you prefer to enter your information manually or, upload
                    a datasheet. Get started today, and take the first step towards reducing
                    your impact!</p>

                <p className="mb-6">You can access the calculator by pressing the 'Calculate Emissions'
                    tab on the navigation bar above, or press this link <a href='/calculate-emissions' style={{ color: "#3d815c" }}>here.</a></p>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <h2 className="text-primary text-2xl font-bold font-mono mb-6">
                    1. On entering the calculator page
                </h2>
            </div>
            <div style={{ maxWidth: '800px' }}>
                <p className="mb-6">when entering the calculator page, you may immediately notice three 
                'sections' on the page. The left side, which contains information about the current project, 
                the middle section, which shows you each individual step that you have so far (just one if you
                just opened the page), and the right section. The right section allows you to type the individual
                data that you have about the transport - it's type, the cargo weight, as well as the address. 
                Let's explore the individual sections in detail:  </p>
            </div>

        </div>
    );
}

export default GuidePage;
