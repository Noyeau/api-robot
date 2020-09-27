



exports.dataGoTo = [
    {
        input: { x: 0, y: 1 }, //haut
        output: {
            FLf: 1,
            FRf: 1,
            RLf: 1,
            RRf: 1,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 0, y: 1 }, //haut
        output: {
            FLf: 1,
            FRf: 1,
            RLf: 1,
            RRf: 1,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 0, y: 0.5 }, //haut /2
        output: {
            FLf: 0.5,
            FRf: 0.5,
            RLf: 0.5,
            RRf: 0.5,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 0, y: 0 }, //centre
        output: {
            // FLf: 0,
            // FRf: 0,
            // RLf: 0,
            // RRf: 0,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 0, y: -1 }, //bas
        output: {
            // FLf: 0,
            // FRf: 0,
            // RLf: 0,
            // RRf: 0,
            FLb: 1,
            FRb: 1,
            RLb: 1,
            RRb: 1
        }
    },
    {
        input: { x: 0, y: -0.5 }, //bas /2
        output: {
            // FLf: 0,
            // FRf: 0,
            // RLf: 0,
            // RRf: 0,
            FLb: 0.5,
            FRb: 0.5,
            RLb: 0.5,
            RRb: 0.5
        }
    },
    {
        input: { x: -1, y: 0 }, //gauche
        output: {
            // FLf: 0,
            FRf: 1,
            RLf: 1,
            // RRf: 0,
            FLb: 1,
            // FRb: 0,
            // RLb: 0,
            RRb: 1
        }
    },
    {
        input: { x: -0.5, y: 0 }, //gauche /2
        output: {
            // FLf: 0,
            FRf: 0.5,
            RLf: 0.5,
            // RRf: 0,
            FLb: 0.5,
            // FRb: 0,
            // RLb: 0,
            RRb: 0.5
        }
    },
    {
        input: { x: 1, y: 0 }, //droite
        output: {
            FLf: 1,
            // FRf: 0,
            // RLf: 0,
            RRf: 1,
            // FLb: 0,
            FRb: 1,
            RLb: 1,
            // RRb: 0
        }
    },
    {
        input: { x: 0.5, y: 0 }, //droite /2
        output: {
            FLf: 0.5,
            // FRf: 0,
            // RLf: 0,
            RRf: 0.5,
            // FLb: 0,
            FRb: 0.5,
            RLb: 0.5,
            // RRb: 0
        }
    },
    {
        input: { x: -1, y: 1 }, // haut gauche
        output: {
            // FLf: 0,
            FRf: 1,
            RLf: 1,
            // RRf: 0,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: -0.5, y: 0.5 }, // haut gauche /2
        output: {
            // FLf: 0,
            FRf: 0.5,
            RLf: 0.5,
            // RRf: 0,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 1, y: 1 }, //haut droit
        output: {
            FLf: 1,
            // FRf: 0,
            // RLf: 0,
            RRf: 1,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: 0.5, y: 0.5 }, //haut droit /2
        output: {
            FLf: 0.5,
            // FRf: 0,
            // RLf: 0,
            RRf: 0.5,
            // FLb: 0,
            // FRb: 0,
            // RLb: 0,
            // RRb: 0
        }
    },
    {
        input: { x: -1, y: -1 }, //bas gauche
        output: {
            // FLf: 0,
            // FRf: 0,
            // RLf: 0,
            // RRf: 0,
            FLb: 1,
            FRb: 0,
            // RLb: 0,
            RRb: 1
        }
    },
    {
        input: { x: 1, y: -1 }, //bas droit
        output: {
            FRb: 1,
            RLb: 1,
        }
    },
    {
        input: { x: -0.5, y: -0.5 }, //bas gauche/2
        output: {
            FLb: 0.5,
            RRb: 0.5
        }
    },
    {
        input: { x: 0.5, y: -0.5 }, //bas droit/2
        output: {
            FRb: 0.5,
            RLb: 0.5,
        }
    }
]


// FLf: 0,
// FRf: 0,
// RLf: 0,
// RRf: 0,
// FLb: 0,
// FRb: 0,
// RLb: 0,
// RRb: 0
exports.dataRotate = [
    /**
     * Centre 
     */
    {
        input: { x: 0, y: 0, z: 0 }, //centre arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 0, y: 0, z: 1 }, //centre Hor
        output: {
            FLf: 1,
            FRf: 0,
            RLf: 1,
            RRf: 0,
            FLb: 0,
            FRb: 1,
            RLb: 0,
            RRb: 1
        }
    },
    {
        input: { x: 0, y: 0, z: -1 }, //centre aHor
        output: {
            FLf: 0,
            FRf: 1,
            RLf: 0,
            RRf: 1,
            FLb: 1,
            FRb: 0,
            RLb: 1,
            RRb: 0
        }
    },


    /**
     * Haut Droit
     */
    {
        input: { x: 1, y: 1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: 1, z: 1 }, // Hor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 1,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: 1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 1,
            RRb: 0
        }
    },

    /**
   * Haut gauche
   */
    {
        input: { x: -1, y: 1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: 1, z: 1 }, // Hor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 1,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: 1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 1
        }
    },

    /**
     * Bas Droit
     */
    {
        input: { x: 1, y: -1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: -1, z: 1 }, // Hor
        output: {
            FLf: 1,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: -1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 1,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },

    /**
   * Bas gauche
   */
    {
        input: { x: -1, y: -1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: -1, z: 1 }, // Hor
        output: {
            FLf: 0,
            FRf: 1,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: -1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 1,
            RLb: 0,
            RRb: 0
        }
    },


      /**
     * Droit
     */
    {
        input: { x: 1, y: 0, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: 0, z: 1 }, // Hor
        output: {
            FLf: 1,
            FRf: 0,
            RLf: 1,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 1, y: 0, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 1,
            FRb: 0,
            RLb: 1,
            RRb: 0
        }
    },

    /**
   * gauche
   */
    {
        input: { x: -1, y: 0, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: 0, z: 1 }, // Hor
        output: {
            FLf: 0,
            FRf: 1,
            RLf: 0,
            RRf: 1,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: -1, y: 0, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 1,
            RLb: 0,
            RRb: 1
        }
    },



          /**
     * Haut
     */
    {
        input: { x: 0, y: 1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 0, y: 1, z: 1 }, // Hor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 1,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 1
        }
    },
    {
        input: { x: 0, y: 1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 1,
            FLb: 0,
            FRb: 0,
            RLb: 1,
            RRb: 0
        }
    },

    /**
   * Bas
   */
    {
        input: { x: 0, y: -1, z: 0 }, // arret
        output: {
            FLf: 0,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 0, y: -1, z: 1 }, // Hor
        output: {
            FLf: 1,
            FRf: 0,
            RLf: 0,
            RRf: 0,
            FLb: 0,
            FRb: 1,
            RLb: 0,
            RRb: 0
        }
    },
    {
        input: { x: 0, y: -1, z: -1 }, // aHor
        output: {
            FLf: 0,
            FRf: 1,
            RLf: 0,
            RRf: 0,
            FLb: 1,
            FRb: 0,
            RLb: 0,
            RRb: 0
        }
    }


]