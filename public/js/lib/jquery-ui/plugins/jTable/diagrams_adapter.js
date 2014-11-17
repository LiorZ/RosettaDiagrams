$(document).ready(function () {
        $('#table_container').jtable({
            title: 'Table of people',
            actions: {
                listAction: '/diagram/list',
                createAction: '/diagram/new',
                updateAction: '/diagram/update',
                deleteAction: '/diagram/delete'
            },
            fields: {
                _id: {
                    key: true,
                    list: false
                },
                name: {
                    title: 'Diagram name',
                    width: '20%'
                },
                description: {
                    title: 'Description',
                    width: '40%',
                    type:'textarea'
                },
                date_created: {
                    title: 'Date created',
                    width: '30%',
                    type: 'date',
                    create: false,
                    edit: false
                }
            }
        });
        
        $('#table_container').jtable('load');
    });