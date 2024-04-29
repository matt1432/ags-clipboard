{
  inputs = {
    nixpkgs = {
      type = "github";
      owner = "NixOS";
      repo = "nixpkgs";
      ref = "nixos-unstable";
    };

    ags = {
      type = "github";
      owner = "Aylur";
      repo = "ags";

      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    ags,
    nixpkgs,
    ...
  }: let
    supportedSystems = ["x86_64-linux"];

    perSystem = attrs:
      nixpkgs.lib.genAttrs supportedSystems (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in
        attrs system pkgs);
  in {
    formatter = perSystem (_: pkgs: pkgs.alejandra);

    devShells = perSystem (system: pkgs: {
      default = pkgs.mkShell {
        packages =
          [ags.packages.${system}.default]
          ++ (with pkgs; [
            bash
            cliphist
            gawk
            gnugrep
            imagemagick
            nodejs_latest
            ripgrep
          ]);
      };
    });
  };
}
