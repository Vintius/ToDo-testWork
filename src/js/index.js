import Vue from 'vue';


window.todo = new Vue({
    el: '.todo',
    data: {
        currentGroupID: 0,
        groups: [],
        deletedGroupIDs: [],
        confirmWindow: false,
        deleteIndex: '',
        deleteType: '',
        moveTo: 'default'
    },
    computed: {
        currentGroup() {
            return this.groups.filter(item => item.id === this.currentGroupID)[0];
        },
        newGroupID() {
            let lastID = Math.max(...this.groups.map(item => item.id)),
                minDeleted = Math.min(...this.deletedGroupIDs);

            return this.deletedGroupIDs.length ? minDeleted : this.groups.length ? ++lastID : 0;
        },
        currentGroupCardsFiltered() {
            let filteredCards = this.currentGroup.cards;

            if (this.currentGroup.filter.length) {
                filteredCards = filteredCards.filter(function (item) {
                            return item.name.toLowerCase().includes(this.toLowerCase());
                }, this.currentGroup.filter)
            }
            if (this.currentGroup.doneFilter) {
                filteredCards = filteredCards.filter(item => item.done);
            }

            return filteredCards;
        }
    },
    methods: {
        addCard() {
            this.currentGroup.cards.push({
                    name: '',
                    text: '',
                    done: false
            })
        },
        addGroup() {
            this.groups.push({
                id: this.newGroupID,
                name: '',
                cards: [],
                filter: '',
                doneFilter: false
            });
            this.deletedGroupIDs.length ? this.deletedGroupIDs.splice(this.deletedGroupIDs.indexOf(this.newGroupID), 1) : 0;
        },
        moveCard(cardIndex) {
            let card = this.currentGroupCardsFiltered.splice(cardIndex, 1)[0];

            this.moveTo.cards.push(card);
        },
        deleteGroup(index) {
            let deletedGroup = this.groups.splice(index, 1)[0];

            this.deletedGroupIDs.push(deletedGroup.id);
            deletedGroup.id === this.currentGroupID ? this.currentGroupID = this.groups[0].id : 0;
            this.confirmWindow = false;
        },
        deleteCard(index) {
            this.currentGroup.cards.splice(index, 1);
            this.confirmWindow = false;
        },
        confirmDelete(index, type) {
            this.confirmWindow = true;
            this.deleteIndex = index;
            this.deleteType = type;
        }
    },
    created() {
        this.addGroup();
    }
});