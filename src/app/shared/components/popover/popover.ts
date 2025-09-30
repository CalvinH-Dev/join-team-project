import { Component, input, output } from "@angular/core";

interface PopoverOption {
	text: string;
	iconSrc: string;
	iconAlt?: string;
}

interface Corners {
	topRight?: boolean;
	bottomRight?: boolean;
	bottomLeft?: boolean;
	topLeft?: boolean;
}

@Component({
	selector: "app-popover",
	imports: [],
	templateUrl: "./popover.html",
	styleUrl: "./popover.scss",
})
export class Popover {
	show = input<boolean>(false);
	title = input<string>("");
	options = input<PopoverOption[]>([]);
	iconSide = input<"left" | "right">("left");
	variant = input<"primary" | "secondary">("primary");
	sharpCorner = input<"topRight" | "bottomRight" | "bottomLeft" | "topLeft">("topRight");

	clicked = output<number>();

	emitClick(index: number) {
		this.clicked.emit(index);
	}
}
