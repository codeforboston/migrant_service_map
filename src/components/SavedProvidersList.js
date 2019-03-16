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
                text={providersById[id].name}
                item={providersById[id]}
            />
        )}
    </div>
        )

export default connect(
    ({providers}) => ({ savedProviders: providers.savedProviders, providersById: providers.byId }),
    { unsaveProvider }
)(List)