import React from "react";
import { connect } from "react-redux";
import {
  displayProviderInformation,
  saveProvider,
  reorderSavedProviders
} from "redux/actions";
import { getSavedProviders } from "redux/selectors.js";
import SavedProvidersList from "./saved-providers-list";
import { DragDropContext } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const SavedProvidersListContainer = props => {
  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      props.savedProviders,
      result.source.index,
      result.destination.index
    );
    const providerIds = items.map(item => item.id);
    props.reorderSavedProviders(providerIds);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <SavedProvidersList {...props} />
    </DragDropContext>
  );
};

const mapStateToProps = state => {
  return {
    searchCenter: state.search.currentLocation
      ? state.search.history[state.search.currentLocation].searchText
      : null,
    savedProviders: getSavedProviders(state),
    highlightedProviders: state.highlightedProviders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveProvider: id => {
      dispatch(saveProvider(id));
    },
    displayProviderInformation: id => {
      dispatch(displayProviderInformation(id));
    },
    reorderSavedProviders: ids => {
      dispatch(reorderSavedProviders(ids));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedProvidersListContainer);
