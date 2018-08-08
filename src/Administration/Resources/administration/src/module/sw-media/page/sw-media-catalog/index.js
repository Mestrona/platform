import { Component, State, Mixin } from 'src/core/shopware';
import CriteriaFactory from 'src/core/factory/criteria.factory';
import mediaMediaGridListener from '../../mixin/mediagrid.listener.mixin';
import mediaSidebarListener from '../../mixin/sibebar.listener.mixin';
import template from './sw-media-catalog.html.twig';
import './sw-media-catalog.less';

Component.register('sw-media-catalog', {
    template,

    mixins: [
        Mixin.getByName('listing'),
        mediaMediaGridListener,
        mediaSidebarListener
    ],

    data() {
        return {
            isLoading: false,
            previewType: 'media-grid-preview-as-grid',
            catalogs: [],
            mediaItems: [],
            lastSelectedItem: null
        };
    },

    computed: {
        mediaItemStore() {
            return State.getStore('media');
        },
        catalogStore() {
            return State.getStore('catalog');
        }
    },

    created() {
        this.onComponentCreated();
    },

    methods: {
        onComponentCreated() {
            this.isLoading = true;

            this.catalogStore.getList({
                page: 1,
                limit: 0
            }).then((response) => {
                this.catalogs = response.items;
            });

            this.isLoading = false;
        },
        getList() {
            this.isLoading = true;
            const params = this.getListingParams();
            const catalogId = this.$route.params.id;

            params.criteria = CriteriaFactory.term('catalogId', catalogId);

            return this.mediaItemStore.getList(params).then((response) => {
                this.total = response.total;
                this.mediaItems = response.items;
                this.isLoading = false;

                return this.mediaItems;
            });
        },
        getLastSelectedItem() {
            const selection = this.$refs.mediaGrid.selection;

            if (selection.length === 0) {
                this.lastSelectedItem = null;
                return;
            }
            this.lastSelectedItem = selection[selection.length - 1];
        },
        handleMediaGridSelectionRemoved() {
            this.getLastSelectedItem();
        },
        handleMediaGridItemSelected() {
            this.getLastSelectedItem();
        },
        handleMediaGridItemUnselected() {
            this.getLastSelectedItem();
        }
    }
});
