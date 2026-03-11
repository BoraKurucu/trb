import React from 'react';
import { render, screen } from '@testing-library/react';
import { CommodityCard } from '../components/CommodityCard';

describe('CommodityCard Component', () => {
    const mockCommodityPositive = {
        id: 'WHEAT',
        name: 'Wheat',
        price: 650.50,
        change24h: 1.25,
        lastUpdate: Date.now()
    };

    const mockCommodityNegative = {
        id: 'CORN',
        name: 'Corn',
        price: 430.20,
        change24h: -0.75,
        lastUpdate: Date.now()
    };

    it('renders commodity name and price correctly', () => {
        render(<CommodityCard commodity={mockCommodityPositive} />);

        expect(screen.getByText('Wheat')).toBeInTheDocument();
        expect(screen.getByText('$650.50')).toBeInTheDocument();
    });

    it('displays positive change in green with up arrow', () => {
        const { container } = render(<CommodityCard commodity={mockCommodityPositive} />);

        // Check if the change percentage is rendered
        expect(screen.getByText('1.25%')).toBeInTheDocument();

        // Check for the green text color class
        const changeElement = screen.getByText('1.25%');
        expect(changeElement).toHaveClass('text-green-500');

        // Check for the ArrowUpRight icon (lucide-react renders an SVG)
        const svgIcon = container.querySelector('svg.lucide-arrow-up-right');
        expect(svgIcon).toBeInTheDocument();
    });

    it('displays negative change in red with down arrow', () => {
        const { container } = render(<CommodityCard commodity={mockCommodityNegative} />);

        // Check if the absolute change percentage is rendered (without the minus sign)
        expect(screen.getByText('0.75%')).toBeInTheDocument();

        // Check for the red text color class
        const changeElement = screen.getByText('0.75%');
        expect(changeElement).toHaveClass('text-red-500');

        // Check for the ArrowDownRight icon
        const svgIcon = container.querySelector('svg.lucide-arrow-down-right');
        expect(svgIcon).toBeInTheDocument();
    });
});
