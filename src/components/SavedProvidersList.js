import React from 'react';
import { connect } from 'react-redux';
import { unsaveProvider } from '../redux/actions';

import './saved-providers-list.css';

const List = (props) => (
    <div className="saved-list">
        <h3>Saved Providers</h3>
        <ul>
            { props.savedProviders.map( (id) => 
                <li key={id}>provider {id} <a href="#" onClick={() => props.unsaveProvider(id)}>remove</a></li>
            )}
        </ul>
    </div>
        )

export default connect(
    ({providers}) => ({ savedProviders: providers.savedProviders }),
    { unsaveProvider }
)(List)