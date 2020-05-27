Jekyll::Hooks.register :posts, :pre_render do |post, payload|

  # make some local variables for convenience
  site = post.site
  liquid_options = site.config["liquid"]

  # create a template object
  template = site.liquid_renderer.file(post.path).parse(post.content)

  # the render method expects this information
  info = {
    :registers        => { :site => site, :page => payload['page'] },
    :strict_filters   => liquid_options["strict_filters"],
    :strict_variables => liquid_options["strict_variables"],
  }

  # render the content into a new property
  post.data['rendered_content'] = template.render!(payload, info)
end
