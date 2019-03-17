import React from 'react';
import { connect } from 'react-redux';
import { unsaveProvider } from '../redux/actions';
import DropdownMenuItem from './Menu/DropdownMenuItem';

import './saved-providers-list.css';

const List = ({ savedProviders, providersById, unsaveProvider }) => (
    <div className="saved-list">
        <h3>Saved Providers</h3>
        { savedProviders.map( id => 
            <DropdownMenuItem
                key={id}
                text={providersById[id].name}
                item={providersById[id]}
            >
                <RemoveButton color="#FB3322" handleClick={() => unsaveProvider(id)} />
            </DropdownMenuItem>
        )}
    </div>
)

const RemoveButton = ({color, handleClick}) => (
    <div className="remove-button" onClick={handleClick}>
        <svg height="16px" width="16px">
            <path
                d="M1,1 L15,15"
                stroke={color}
                strokeWidth="4px"
            />
            <path
                d="M1,15 L15,1"
                stroke={color}
                strokeWidth="4px"
            />
        </svg>
        remove&nbsp;
    </div>
)

export default connect(
    ({providers}) => ({ savedProviders: providers.savedProviders, providersById: providers.byId }),
    { unsaveProvider }
)(List)