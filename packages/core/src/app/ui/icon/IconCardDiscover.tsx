import React, { FunctionComponent } from 'react';

import withIconContainer from './withIconContainer';

const IconCardDiscover: FunctionComponent = () => (
    <svg
        aria-labelledby="iconCardDiscoverTitle"
        height="104"
        role="img"
        viewBox="0 0 152 104"
        width="152"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <title id="iconCardDiscoverTitle">Discover</title>
        <defs>
            <rect height="104" id="a" rx="12" width="152" />
        </defs>
        <g fill="none" fillRule="evenodd">
            <mask fill="#fff" id="b">
                <use xlinkHref="#a" />
            </mask>
            <use fill="#F4F4F4" xlinkHref="#a" />
            <rect fill="#F4F4F4" height="104" mask="url(#b)" rx="12" width="152" x="1" />
            <path
                d="M70.553 104H149c2.21 0 4-1.783 4-4.007V46.597C142.305 71.907 111.28 93.04 70.553 104z"
                fill="#F76E20"
                mask="url(#b)"
            />
            <g mask="url(#b)" transform="translate(19 42)">
                <path
                    d="M14.763 9.22c0 2.94-.824 5.19-2.47 6.752-1.652 1.56-4.035 2.344-7.15 2.344H.155V.466H5.68c2.876 0 5.106.772 6.69 2.31C13.97 4.31 14.764 6.46 14.764 9.22zm-3.876.1c0-3.834-1.672-5.75-5.004-5.75h-1.99v11.62h1.602c3.596.002 5.392-1.957 5.392-5.87zM17.51 18.316V.466h3.733v17.85H17.51zM34.774 13.608c0 1.616-.57 2.88-1.718 3.81-1.146.927-2.734 1.397-4.773 1.397-1.874 0-3.54-.36-4.987-1.074v-3.516c1.19.543 2.196.915 3.017 1.14.822.218 1.577.327 2.26.327.815 0 1.446-.16 1.882-.475.43-.313.657-.792.657-1.413 0-.35-.095-.66-.292-.933-.188-.277-.474-.54-.85-.79-.374-.25-1.134-.657-2.28-1.21-1.073-.512-1.877-1.008-2.42-1.477-.542-.47-.967-1.018-1.288-1.65-.32-.63-.48-1.363-.48-2.2 0-1.577.526-2.818 1.582-3.72 1.06-.908 2.514-1.356 4.38-1.356.913 0 1.787.108 2.617.328.83.217 1.702.53 2.607.927l-1.203 2.942c-.94-.39-1.72-.67-2.334-.818-.616-.153-1.22-.232-1.81-.232-.71 0-1.254.164-1.627.502-.38.334-.567.768-.567 1.305 0 .335.076.623.23.875.152.25.395.487.728.72.332.23 1.125.647 2.366 1.25 1.643.8 2.77 1.6 3.384 2.4.613.796.92 1.778.92 2.943zM46.018 3.62c-1.406 0-2.49.54-3.263 1.605C41.98 6.295 41.6 7.79 41.6 9.7c0 3.978 1.473 5.97 4.418 5.97 1.238 0 2.727-.305 4.492-.94v3.175c-1.446.613-3.06.916-4.842.916-2.56 0-4.52-.79-5.875-2.367-1.357-1.572-2.034-3.834-2.034-6.782 0-1.855.335-3.48 1.003-4.874.662-1.402 1.623-2.467 2.87-3.212C42.884.84 44.345.467 46.022.467c1.71 0 3.43.42 5.152 1.258l-1.203 3.077c-.663-.317-1.32-.592-1.99-.83-.67-.238-1.322-.352-1.964-.352zM81.828.467h3.77l-5.98 17.85h-4.07L69.578.466h3.772l3.312 10.62c.182.632.38 1.356.572 2.195.19.836.316 1.408.368 1.737.087-.75.387-2.05.902-3.932L81.828.468zM97.072 18.316h-10.14V.466h10.14V3.57h-6.407v3.92h5.964v3.1h-5.965v4.6h6.407v3.126zM105.128 11.467v6.85h-3.732V.466h5.13c2.39 0 4.158.44 5.31 1.326 1.145.882 1.72 2.22 1.72 4.02 0 1.048-.286 1.987-.853 2.802-.57.82-1.376 1.46-2.418 1.925 2.647 4.007 4.37 6.603 5.175 7.773h-4.142l-4.203-6.85-1.987.004zm0-3.077h1.206c1.177 0 2.05-.2 2.612-.596.558-.402.842-1.03.842-1.883 0-.847-.29-1.445-.862-1.806-.573-.36-1.46-.537-2.664-.537h-1.14l.006 4.823z"
                    fill="#414042"
                />
                <ellipse cx="61.024" cy="9.393" fill="#F76E20" rx="8.802" ry="8.926" />
            </g>
        </g>
    </svg>
);

export default withIconContainer(IconCardDiscover);
