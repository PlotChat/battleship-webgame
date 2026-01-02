export function Button({
	content = "Button",
	variant = "primary",
	callback = () => {},
}) {
	const button = document.createElement("button");
	button.className = `button button--${variant}`;
	button.addEventListener("click", callback);

	const span = document.createElement("span");
	span.className = "button__text";
	span.innerHTML = content;

	button.append(span);

	return button;
}
