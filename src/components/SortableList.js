import uniqueId from 'lodash/uniqueId';
import React from 'react';
import ReactSortable from 'react-sortablejs';
import { map, find } from 'lodash';

const stylesList = {
    list: {
        flexGrow: 1,
        background: "#cce5ff",
        margin: "5px",
        border: "3px solid #2A2424",
        borderRadius: '.25em',
        maxWidth: '14em',
    },
};
// Functional Component
const SortableList = ({ sections,items, onChange }) => {
    let sortable = null; // sortable instance
    if(sections.length!=0){
        for (var j = 0; j < sections.length; j++) {
            console.log("aSa"+sections[j].id);
        }
    }
    if (items.length != 0) {
        const listItems = items.map(val => (<li style={{ background: "#eee", marginLeft: "auto", marginRight: 'auto', marginBottom: '5px', border: "1px solid #ccc", borderRadius: '2px', maxWidth: "14em" }} key={uniqueId()} data-id={val.id}>{val.name}</li>));

        return (
            <div className="ul">
                <br />
                <h3>Order of sections</h3>
                <ReactSortable style={{ border: '1px solid #eee' }}
                    // Sortable options (https://github.com/RubaXa/Sortable#options)
                    options={{
                    }}

                    // [Optional] Use ref to get the sortable instance
                    // https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute
                    ref={(c) => {
                        if (c) {
                            sortable = c.sortable;
                        }
                    }}

                    // [Optional] A tag to specify the wrapping element. Defaults to "div".
                    tag="ul"

                    // [Optional] The onChange method allows you to implement a controlled component and keep
                    // DOM nodes untouched. You have to change state to re-render the component.
                    // @param {Array} order An ordered array of items defined by the `data-id` attribute.
                    // @param {Object} sortable The sortable instance.
                    // @param {Event} evt The event object.
                    onChange={(order, sortable, evt) => {
                        const listSections = map(order, (id) => find(sections, (o) => o.id.toString() === id));
                        onChange(listSections);
                        // onChange(order);
                    }}
                >
                    {listItems}
                </ReactSortable>
            </div>
        );
    }else return null;
    SortableList.propTypes = {
        items: React.PropTypes.array,
        onChange: React.PropTypes.func
    };
};



export default SortableList;