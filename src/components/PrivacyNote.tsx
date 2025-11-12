export function PrivacyNote() {
	return (
		<div className="max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
				🔒 Privacy Control
			</h3>
			<p className="text-blue-700 text-sm">
				Choose whether your GIFs are private (link-only) or public (appear in
				gallery). Private GIFs are secure by default - only people with the
				direct link can view them.
			</p>
		</div>
	);
}
