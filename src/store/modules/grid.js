const state = {
  cells: [0, 0, 0, 0, "X"],
  pattern: null,
  dim: 8
};

const actions = {
  async setPattern({ state, dispatch, commit }) {
    const pattern = [];
    const dim = state.dim;

    for (let row = 0; row < dim; row++) {
      const colPattern = await dispatch("setColPattern", {
        row,
        pattern
      });

      pattern.push(colPattern);
    }

    commit("setPattern", pattern);
  },

  async setColPattern({ state }, { row, pattern }) {
    const dim = state.dim;
    const colPattern = [];

    for (let col = 0; col < dim; col++) {
      const randomIdx = Math.floor(Math.random() * state.cells.length);
      let cell = state.cells[randomIdx];

      let prevCell = colPattern[col - 1];
      if (colPattern[col - 1]) {
        if (typeof cell === "string" && typeof prevCell.data === "number")
          colPattern[col - 1].data = prevCell.data + 1;
        if (typeof cell === "number" && typeof prevCell.data === "string")
          cell += 1;
      }

      if (row > 0) {
        const prevUpperLeft = pattern[row - 1][col - 1];
        const prevUpperMid = pattern[row - 1][col];
        const prevUpperRight = pattern[row - 1][col + 1];

        if (prevUpperLeft) {
          if (
            typeof cell === "string" &&
            typeof prevUpperLeft.data === "number"
          )
            pattern[row - 1][col - 1].data = prevUpperLeft.data + 1;

          if (
            typeof cell === "number" &&
            typeof prevUpperLeft.data === "string"
          )
            cell += 1;
        }

        if (prevUpperMid) {
          if (typeof cell === "string" && typeof prevUpperMid.data === "number")
            pattern[row - 1][col].data = prevUpperMid.data + 1;

          if (typeof cell === "number" && typeof prevUpperMid.data === "string")
            cell += 1;
        }

        if (prevUpperRight) {
          if (
            typeof cell === "string" &&
            typeof prevUpperRight.data === "number"
          )
            pattern[row - 1][col + 1].data = prevUpperRight.data + 1;

          if (
            typeof cell === "number" &&
            typeof prevUpperRight.data === "string"
          )
            cell += 1;
        }
      }

      colPattern.push({
        data: cell,
        display: false,
        flagged: false
      });
    }
    return colPattern;
  },
  openCell({ state, dispatch, commit }, { row, col }) {
    let pattern = state.pattern;
    if (!pattern[row] || !pattern[row][col]) return;
    if (pattern[row][col].flagged) return;

    let cell = pattern[row][col];
    if (cell.data === 0) {
      if (cell.display) return;
      dispatch("floodFill", {
        cell,
        row,
        col
      });
    }
    commit("openCell", cell);
  },
  flagCell({ commit, state }, { row, col }) {
    let cell = state.pattern[row][col];
    if (cell.display) return;
    commit("flagCell", { cell });
  },
  floodFill({ dispatch, commit }, { cell, row, col }) {
    commit("openCell", cell);
    dispatch("openCell", { row, col: col + 1 });
    dispatch("openCell", { row, col: col - 1 });
    dispatch("openCell", { row: row + 1, col });
    dispatch("openCell", { row: row - 1, col });
  }
};

const mutations = {
  setPattern(state, pattern) {
    state.pattern = pattern;
  },
  openCell(_, cell) {
    cell.display = true;
  },
  flagCell(_, { cell }) {
    cell.flagged = !cell.flagged;
  }
};

const getters = {
  getPattern(state) {
    return state.pattern;
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
