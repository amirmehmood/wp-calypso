/**
 * Internal dependencies
 */
import viewport from 'lib/viewport';
import scrollTo from 'lib/scroll-to';

const BULLSEYE_RADIUS = 6;
const DIALOG_WIDTH = 410;
const DIALOG_HEIGHT = 150;
const DIALOG_PADDING = 10;
const MASTERBAR_HEIGHT = 48;

const middle = ( a, b ) => Math.abs( b - a ) / 2;

const wouldBeOffscreen = pos =>
	pos < 0 || ( pos + DIALOG_PADDING + DIALOG_WIDTH ) >
		document.documentElement.clientWidth;

const fitOnScreen = pos =>
	Math.max( 0, pos - DIALOG_PADDING - DIALOG_WIDTH ) / 2;

const dialogPositioners = {
	below: ( { left, bottom } ) => ( {
		x: wouldBeOffscreen( left )
			? fitOnScreen( document.documentElement.clientWidth )
			: left + DIALOG_PADDING,
		y: bottom + DIALOG_PADDING,
	} ),
	beside: ( { left, right, top } ) => ( {
		x: wouldBeOffscreen( right )
			? fitOnScreen( left )
			: right + DIALOG_PADDING,
		y: top + DIALOG_PADDING,
	} ),
	center: ( { left, right } ) => ( {
		x: Math.max( 0, middle( left, right ) - DIALOG_WIDTH / 2 ),
		y: MASTERBAR_HEIGHT / 2,
	} ),
	middle: ( { left, right } ) => ( {
		x: Math.max( 0, middle( left, right ) - DIALOG_WIDTH / 2 ),
		y: MASTERBAR_HEIGHT / 2 + DIALOG_HEIGHT / 2,
	} ),
	right: () => ( {
		x: document.documentElement.clientWidth - DIALOG_WIDTH - ( 3 * DIALOG_PADDING ),
		y: MASTERBAR_HEIGHT + ( 3 * DIALOG_PADDING ),
	} ),
};

export const query = selector =>
	[].slice.call( global.window.document.querySelectorAll( selector ) );

export const posToCss = ( { x, y } ) => ( {
	top: y ? y + 'px' : undefined,
	left: x ? x + 'px' : undefined,
} );

const bullseyePositioners = {
	below: ( { left, right, bottom } ) => ( {
		x: left + middle( left, right ) - BULLSEYE_RADIUS,
		y: bottom - BULLSEYE_RADIUS * 1.5,
	} ),

	beside: ( { top, bottom, right } ) => ( {
		x: right - BULLSEYE_RADIUS * 1.5,
		y: top + middle( top, bottom ) - BULLSEYE_RADIUS,
	} ),

	center: () => ( {} ),
	middle: () => ( {} ),
};

export function targetForSlug( targetSlug ) {
	return query( '[data-tip-target="' + targetSlug + '"]' )[0];
}

export function getStepPosition( { placement = 'center', targetSlug } ) {
	const target = targetForSlug( targetSlug );
	const scrollDiff = scrollIntoView( target );
	const rect = target && target.getBoundingClientRect
		? target.getBoundingClientRect()
		: global.window.document.body.getBoundingClientRect();
	const position = dialogPositioners[ validatePlacement( placement, target ) ]( rect );

	return {
		x: position.x,
		y: position.y - scrollDiff +
			( scrollDiff !== 0 ? DIALOG_PADDING : 0 )
	};
}

export function getBullseyePosition( { placement = 'center', targetSlug } ) {
	const target = targetForSlug( targetSlug );

	const rect = target
		? target.getBoundingClientRect()
		: global.window.document.body.getBoundingClientRect();

	return bullseyePositioners[ validatePlacement( placement ) ]( rect );
}

function validatePlacement( placement, target ) {
	const targetSlug = target && target.dataset && target.dataset.tipTarget;

	if ( targetSlug === 'sidebar' && viewport.isMobile() ) {
		return 'middle';
	}

	return ( placement !== 'center' && viewport.isMobile() )
		? 'below'
		: placement;
}

function getScrollDiff( targetSlug, container ) {
	if ( targetSlug !== 'themes' ) {
		return 0;
	}

	const target = targetForSlug( targetSlug );
	const { top, bottom } = target.getBoundingClientRect();
	const dialogWillFit = bottom + DIALOG_PADDING + DIALOG_HEIGHT <=
			document.documentElement.clientHeight;

	if ( dialogWillFit ) {
		return 0;
	}

	const scrollMax = container.scrollHeight -
		container.clientHeight - container.scrollTop;

	return Math.min( .75 * top, scrollMax );
}

function scrollIntoView( target ) {
	const targetSlug = target && target.dataset && target.dataset.tipTarget;

	if ( targetSlug !== 'themes' ) {
		return 0;
	}

	const sidebar = query( '#secondary .sidebar' )[ 0 ];
	const y = getScrollDiff( targetSlug, sidebar );

	scrollTo( { y: y, container: sidebar, duration: 300 } );
	return y;
}

function getScrolledRect( targetSlug, scrollY ) {
	const target = targetForSlug( targetSlug );
	const rect = target.getBoundingClientRect();
	return {
		top: rect.top - scrollY,
		bottom: rect.bottom - scrollY,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
	};
}

export function getScrolledRectFromBase( targetSlug, baseElement ) {
	const scrollY = getScrollDiff( targetSlug, baseElement );
	return getScrolledRect( targetSlug, scrollY );
}

export function getOverlayStyle( { rect } ) {
	const clientHeight = document.documentElement.clientHeight;
	const correctedRect = {
		top: rect.top,
		left: rect.left < 0 ? 0 : rect.left,
		height: rect.height,
		width: rect.width,
		right: rect.left < 0 ? rect.right - rect.left : rect.right,
		bottom: rect.bottom,
	};

	return {
		top: {
			top: '0px',
			right: '0px',
			height: correctedRect.top + 'px',
			left: '0px',
		},
		left: {
			top: correctedRect.top + 'px',
			width: correctedRect.left + 'px',
			bottom: clientHeight - correctedRect.height - correctedRect.top + 'px',
			left: '0px',
		},
		right: {
			top: correctedRect.top + 'px',
			right: '0px',
			bottom: clientHeight - correctedRect.height - correctedRect.top + 'px',
			left: correctedRect.right + 'px',
		},
		bottom: {
			top: correctedRect.bottom + 'px',
			right: '0px',
			bottom: '0px',
			left: '0px',
		},
	};
}
