/**
* External dependencies
*/
var React = require( 'react' );

/**
 * Internal dependencies
 */
var SmallPostCard = require( 'components/post-card/small' );

var PostCards = React.createClass( {
	displayName: 'PostCards',

	render: function() {
		const items = [
			{
				post: {
					ID: 1,
					title: 'What cats are best for coastal Maine?',
					site_ID: 1234,
					site_name: 'All the catsss',
					global_ID: 1,
					canonical_image: {
						uri: 'http://lorempixel.com/256/256/cats/',
						height: 256,
						width: 256
					}
				},
				site: {
					ID: 1234,
					title: 'All the cats',
					URL: 'http://www.allthecats.com',
					icon: {
						img: 'http://lorempixel.com/64/64/cats/'
					}
				}
			},
			{
				post: {
					ID: 2,
					title: 'No Site? No Problem.',
					site_ID: 99,
					site_name: '99 Problems',
					global_ID: 2,
					canonical_image: {
						uri: 'http://lorempixel.com/1024/256/sports/',
						height: 256,
						width: 1024
					}
				}
			},
			{
				post: {
					ID: 3,
					title: 'Seven weird numbers that are even lonlier than one. You won\'t believe number 4',
					site_ID: 7,
					site_name: 'Made You Click! Made You Click! Made You Click! Made You Click! Made You Click! Made You Click! Made You Click! Made You Click! Made You Click! Made You Click!',
					global_ID: 2,
					canonical_image: {
						uri: 'http://lorempixel.com/128/96/sports/',
						height: 96,
						width: 128
					}
				}
			}
		];
		return (
			<div className="design-assets__group">
				<h2>
					<a href="/devdocs/design/post-card">Post Card</a>
				</h2>
				<div>
					{ items.map( item => <SmallPostCard post={ item.post } site={ item.site } /> ) }
				</div>
			</div>
		);
	},

	toggleCards: function() {
		this.setState( { compactCards: ! this.state.compactCards } );
	}
} );

module.exports = PostCards;