/**
 * WordPress dependencies
 */
import { createSelector, createRegistrySelector } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { State } from './selectors';
import { STORE_NAME } from './name';

type EntityRecordKey = string | number;

/**
 * Returns the previous edit from the current undo offset
 * for the entity records edits history, if any.
 *
 * @param state State tree.
 *
 * @return The undo manager.
 */
export function getUndoManager( state: State ) {
	return state.undoManager;
}

/**
 * Retrieve the fallback Navigation.
 *
 * @param state Data state.
 * @return The ID for the fallback Navigation post.
 */
export function getNavigationFallbackId(
	state: State
): EntityRecordKey | undefined {
	return state.navigationFallbackId;
}

export const getBlockPatternsForPostType = createRegistrySelector(
	( select: any ) =>
		createSelector(
			( state, postType ) =>
				select( STORE_NAME )
					.getBlockPatterns()
					.filter(
						( { postTypes } ) =>
							! postTypes ||
							( Array.isArray( postTypes ) &&
								postTypes.includes( postType ) )
					),
			() => [ select( STORE_NAME ).getBlockPatterns() ]
		)
);

/**
 * Returns the entity records permissions for the given entity record ids.
 */
export const getEntityRecordsPermissions = createRegistrySelector( ( select ) =>
	createSelector(
		( state: State, kind: string, name: string, ids: string[] ) => {
			return ids.map( ( id ) => ( {
				delete: select( STORE_NAME ).canUser( 'delete', {
					kind,
					name,
					id,
				} ),
				update: select( STORE_NAME ).canUser( 'update', {
					kind,
					name,
					id,
				} ),
			} ) );
		},
		( state ) => [ state.userPermissions ]
	)
);
